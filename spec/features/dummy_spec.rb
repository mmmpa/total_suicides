require 'capybara_helper'

feature 'チャートページ' do
  before :each do |ex|
    pp ex
  end
feature 'あるコンテキスト' do
  feature 'ある機能' do
    scenario 'ある一連の確認' do |example|
      p example.description
      # "ある一連の確認"
      p example.full_description
      # "あるコンテキスト ある機能 ある一連の確認"
    end
  end
end
end