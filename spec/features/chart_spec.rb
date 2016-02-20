require 'capybara_helper'

feature 'チャートページ' do
  before :each do |ex|
    ready_ss(ex)
  end

  feature '横軸が年のチャート' do
    before :each do |ex|
      visit '/'
      find('.data-selector.x input[value="year"]').click
      find('.data-selector.y input[value="area"]').click
      find('.data-selector.y-specifier input[value="0"]').click
      find('button.submit').click

      sleep 0.5
      take_ss('チャートを表示')
    end

    scenario 'チャートの追加' do

    end
  end

  feature '横軸が年以外のチャート' do
    before :each do |ex|
      visit '/'
      find('.data-selector.x input[value="area"]').click
      find('.data-selector.y input[value="gender"]').click
      find('.data-selector.y-specifier input[value="0"]').click
      find('.data-selector.z-specifier input[value="26"]').click
      find('button.submit').click

      sleep 0.5
      take_ss('チャートを表示')
    end

    scenario 'チャートの追加' do

    end
  end
end