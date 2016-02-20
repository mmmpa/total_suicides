require 'capybara_helper'

feature 'チャートページ' do
  before :each do |ex|
    ready_ss(ex, 800)
  end

  scenario '全てのチャート' do
    visit '/'

    queries = [
      '.data-selector.x input',
      '.data-selector.y input',
      '.data-selector.y-specifier input',
      '.data-selector.z-specifier input'
    ]
    combinations = []

    all(queries[0]).each do |x|
      x.click
      all(queries[1]).each do |y|
        y.click
        all(queries[2])[0..3].each do |y_specifier|
          y_specifier.click
          z = all(queries[3])
          if z.size != 0
            combinations.push [x.value, y.value, y_specifier.value, z.first.value]
          else
            combinations.push [x.value, y.value, y_specifier.value]
          end
        end
      end
    end

    combinations.each do |combination|
      visit '/'
      combination.zip(queries) do |value, query|
        find(query + %{[value="#{value}"]}).click if value.present?
      end
      find('button.submit').click
      sleep 0.5
      take_ss('チャートを表示')
    end
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