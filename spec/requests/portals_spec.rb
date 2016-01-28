require 'rails_helper'

describe PortalController, type: :request do
  describe 'get' do
    it do
      get portal_path
      expect(response).to have_http_status(200)
    end
  end
end
