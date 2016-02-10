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
      expect(TableCreator.detect(:year, :area, :gender)).to eq(nil)
    end

    it do
      expect(TableCreator.detect(:year, :way)).to eq(:way)
    end
  end

  describe do
    context 'type1' do
      let(:params){
        {
          'base' => 'way',
          'table' => 'area',
          'x' => 'gender',
          'y' => 'none',
          'area' => '1'
        }
      }

      it do
        pp TableCreator.(params)
      end
    end

    context 'type2' do
      let(:params){
        {
          'base' => 'year',
          'table' => 'area',
          'x' => 'gender',
          'y' => 'way',
          'area' => '2'
        }
      }

      it do
        TableCreator.(params)
      end
    end

    context 'type3' do
      let(:params){
        {
          'base' => 'year',
          'table' => 'gender',
          'x' => 'way',
          'y' => 'area',
          'area' => '3'
        }
      }

      it do
        TableCreator.(params)
      end
    end

    context 'type4' do
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

    context 'type5' do
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

    context 'type6' do
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
        pp TableCreator.(params)
      end
    end

    context 'type7' do
      let(:params){
        {
          'base' => 'year',
          'table' => 'total',
          'x' => 'gender',
          'y' => 'area',
          'area' => '1,2,3'
        }
      }

      it do
        pp TableCreator.(params)
      end
    end
  end
end
