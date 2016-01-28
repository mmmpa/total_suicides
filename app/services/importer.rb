require 'csv'

class Importer
  include ImporterMetadata

  attr_accessor :file_path, :file_name

  def self.call(file_name)
    new(file_path: "#{Rails.root}/db/csv/#{file_name}", file_name: file_name).import
  end

  def initialize(**options)
    self.file_path = options[:file_path]
    self.file_name = options[:file_name]
  end

  def import
    year = detect_year(detect_year_id(file_name))
    gender = detect_gender(detect_gender_id(file_name))

    csv = CSV.read(file_path, encoding: 'cp932') rescue CSV.read(file_path)

    index.to_a.each.with_index do |i, area_code|
      line = csv[i]
      area = detect_area(area_code, line[area_index])

      tables.map do |name|
        metadata = send(name)
        klass = classify(name)
        params = {year: year, gender: gender, area: area}
        metadata[:range].to_a.each_with_index do |n, index|
          params.merge!(metadata[:columns][index] => line[n])
        end
        klass.create!(params)
      end
    end
  end

  def classify(string)
    eval(string.classify)
  end

  def find_or_create_record(klass, content, name = nil)
    if (target = klass.find_by(content: content))
      return target
    end

    klass.create!(content: content, name: name)
  end

  def detect_year(id)
    find_or_create_record(Year, id)
  end

  def detect_gender(id)
    find_or_create_record(Gender, id)
  end

  def detect_area(id, name)
    find_or_create_record(Area, id, name)
  end

  def detect_year_id(file_name)
    file_name.match(/[0-9]+/).to_s.to_i
  end

  def detect_gender_id(file_name)
    if female?(file_name)
      Gender.detect_content(:female)
    elsif total?(file_name)
      Gender.detect_content(:total)
    else
      Gender.detect_content(:male)
    end
  end

  def female?(string)
    string.include?('female')
  end

  def total?(string)
    string.include?('total')
  end
end