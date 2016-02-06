require 'rails_helper'

describe TableCreator do
  describe 'detect table' do
    it do
      expect(TableCreator.detect_table(:year)).to eq(Year)
    end

    it do
      expect { TableCreator.detect_table(:wow) }.to raise_error(TableCreator::NotAcceptable)
    end
  end

  describe 'detect' do
    it do
      expect(TableCreator.detect(:year, :area, :gender)).to eq(Total)
    end

    it do
      expect(TableCreator.detect(:year, :way)).to eq(Way)
    end
  end

  describe do
    context do
      let(:params){
        {
          'base' => 'year',
          'table' => 'area',
          'x' => 'gender',
          'y' => 'way',
          'area' => '1,2,3'
        }
      }

      it do
        TableCreator.(params)
      end
    end

    context 'none' do
      let(:params){
        {
          'base' => 'year',
          'table' => 'gender',
          'x' => 'way',
          'y' => 'none',
          'area' => '0,1,2,3'
        }
      }

      it do
        pp TableCreator.(params)
      end
    end

    context 'nothing' do
      let(:params){
        {
          'base' => 'year',
          'table' => 'area',
          'x' => 'gender',
          'y' => 'none',
          'area' => '1,2,3'
        }
      }

      it do
        pp TableCreator.(params)
      end
    end

    context do
      let(:params){
        {
          'base' => 'year',
          'table' => 'way',
          'x' => 'gender',
          'y' => 'area',
          'area' => '1,2,3'
        }
      }

      it do
        TableCreator.(params)
      end
    end
  end
end
