module Tagged
  extend ActiveSupport::Concern
  included do |klass|
    pluralized = klass.to_s.downcase.pluralize
    belongs_to :gender, inverse_of: pluralized
    belongs_to :area, inverse_of: pluralized
    belongs_to :year, inverse_of: pluralized

    validates :gender, :area, :year,
              presence: true

    validates :gender,
              uniqueness: {scope: [:area, :year]}

    scope :in, ->(target_year) { includes { year }.joins { year }.where { year.content.in target_year } }
    scope :at, ->(target_area) { includes { area }.joins { area }.where { area.content.in target_area } }
    scope :by, ->(target_gender) { includes { gender }.joins { gender }.where { gender.content.in target_gender } }

    def tagged_data
      {
        year: year.as_json,
        area: area.as_json,
        gender: gender.as_json
      }
    end

    def value_columns
      self.class.columns.map(&:name).select { |name| !name.include?('_id') || name == 'id' }.map(&:to_sym)
    end

    def value_total
      @stored_total ||= value_columns.inject(0) { |a, name| a + self.send(name) }
    end

    def per(n, total)
      (n / total.to_f * 100).round(2)
    end

    def pick_number_and_per
      value_columns.inject({}) { |a, name|
        a.merge!(name => {
          number: self.send(name),
          per: per(self.send(name), value_total)
        })
      }
    end

    def as_json(options = {})
      if respond_to?(:number)
        {number: {
          number: self.number,
          per: self.rate
        }}
      else
        pick_number_and_per
      end.merge!(tagged_data)
    end
  end
end