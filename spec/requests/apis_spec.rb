require 'rails_helper'

describe ApiController, type: :request do
  let(:json) do
    base = JSON.parse(response.body)
    if Array === base
      base.map(&:deep_symbolize_keys)
    else
      base.deep_symbolize_keys
    end
  end

  describe 'get' do
    it do
      get api_total_path(gender: '-', year: '21,22', area: '-')
      expect(json.size).to eq(49 * 6)
    end

    it do
      get api_total_path(gender: '-', year: '-', area: '1, 2')
      expect(json.size).to eq(3 * 2 * 3)
    end

    it do
      get api_total_path(gender: '1, 2', year: '-', area: '-')
      expect(json.size).to eq(3 * 49 * 2)
    end

    it do
      get api_total_path(gender: '-', year: '21', area: '-')
      expect(json.first[:number]).to eq(9306)
    end

    it do
      get api_age_path(gender: '-', year: '21', area: '-')
      expect(json.first[:o0]).to eq(205)
    end

    it do
      get api_age_path(gender: '2', year: '21', area: '1')
      expect(json.first[:o0]).to eq(16)
    end
  end
end
