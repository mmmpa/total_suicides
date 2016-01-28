require 'rails_helper'

describe Importer do
  before :all do
    ActiveRecord::Base.establish_connection(:test_sqlite)
    load "#{Rails.root}/db/schema.rb"
  end

  after :all do
    ActiveRecord::Base.establish_connection(:test)
  end

  describe 'import' do
    it do
      Importer.('21_male.csv')
      Importer.('21_female.csv')
      Importer.('21_total.csv')

      expect(Gender.count).to eq(3)
      expect(Area.count).to eq(49)
      expect(Year.count).to eq(1)

      expect(Age.count).to eq(147)
      expect(Housemate.count).to eq(147)
      expect(Job.count).to eq(147)
      expect(Location.count).to eq(147)
      expect(Way.count).to eq(147)
      expect(Hour.count).to eq(147)
      expect(Day.count).to eq(147)
      expect(Reason.count).to eq(147)
      expect(Attempted.count).to eq(147)
      expect(Total.count).to eq(147)
    end
  end

  describe 'private behavior methods' do
    let(:importer) { Importer.new }
    let(:file_name1) { '22_female.csv' }
    let(:file_name2) { '22_male.csv' }

    describe 'analyze file name' do
      it { expect(importer.detect_year_id(file_name1)).to eq(22) }
      it { expect(importer.detect_gender_id(file_name1)).to eq(1) }
      it { expect(importer.detect_gender_id(file_name2)).to eq(2) }
    end

    describe 'get target record' do
      it { expect(importer.detect_year(22)).to be_a(Year) }
      it { expect(importer.detect_gender(0)).to be_a(Gender) }
      it { expect(importer.detect_area(0, '全国')).to be_a(Area) }
    end

    describe 'classify' do
      it { expect(importer.classify('importer').new).to be_a(Importer) }
    end

    describe 'find or create' do
      it do
        expect {
          importer.detect_year(22)
        }.to change(Year, :count).by(1)

        expect {
          importer.detect_year(22)
        }.not_to change(Year, :count)
      end

      it do
        expect {
          importer.detect_gender(0)
          importer.detect_gender(1)
        }.to change(Gender, :count).by(2)

        expect {
          importer.detect_gender(0)
          importer.detect_gender(1)
        }.not_to change(Gender, :count)
      end

      it do
        expect {
          importer.detect_area(0, '全国')
        }.to change(Area, :count).by(1)

        expect {
          importer.detect_area(0, '全国')
        }.not_to change(Area, :count)
      end
    end
  end
end