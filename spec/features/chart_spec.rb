require 'capybara_helper'

feature 'チャートページ' do
  before :each do |ex|
    ready_ss(ex)
  end

  feature 'チャートの横軸編集' do
    before :each do |ex|
      visit '/'
      find('.data-selector.x input[value="year"]').click
      find('.data-selector.y input[value="area"]').click
      find('.data-selector.y-specifier input[value="0"]').click
      find('button.submit').click
    end

    scenario '縦軸1つ' do
      take_ss('すべて表示', 0.5)
      expect(all('.chart-container .c3-axis-x g.tick').size).to eq(3)

      all('.x-specifier-list input')[0].click

      take_ss('一つ減らす', 0.5)
      expect(all('.chart-container .c3-axis-x g.tick').size).to eq(2)

      all('.x-specifier-list input')[0].click

      take_ss('戻す', 0.5)
      expect(all('.chart-container .c3-axis-x g.tick').size).to eq(3)
    end

    scenario '縦軸複数' do
      find('.data-selector.y input[value="area"]').click
      find('.data-selector.y-specifier input[value="1"]').click
      find('button.submit').click

      take_ss('すべて表示', 0.5)
      expect(all('.chart-container .c3-axis-x g.tick').size).to eq(3)

      all('.x-specifier-list input')[0].click

      take_ss('一つ減らす', 0.5)
      expect(all('.chart-container .c3-axis-x g.tick').size).to eq(2)

      all('.x-specifier-list input')[0].click

      take_ss('戻す', 0.5)
      expect(all('.chart-container .c3-axis-x g.tick').size).to eq(3)
    end
  end

  feature 'チャートの削除' do
    before :each do |ex|
      visit '/'
      find('.data-selector.x input[value="year"]').click
      find('.data-selector.y input[value="area"]').click
      find('.data-selector.y-specifier input[value="0"]').click
      find('button.submit').click
    end

    scenario '削除' do
      take_ss('縦軸が1つだと削除できない', 0.5)
      expect(all('button.delete[disabled]').size).to eq(1)

      find('.data-selector.y input[value="area"]').click
      find('.data-selector.y-specifier input[value="1"]').click
      find('button.submit').click

      take_ss('2つ以上のチャートで削除ボタン有効化', 0.5)
      expect(all('.chart-container .c3-legend-item').size).to eq(2)
      expect(all('button.delete[disabled]').size).to eq(0)
      expect(all('button.delete').size).to eq(2)

      all('button.delete')[1].click

      take_ss('追加された方を削除', 0.5)
      expect(all('button.delete[disabled]').size).to eq(1)
      expect(all('.chart-container .c3-legend-item').size).to eq(1)

      find('.data-selector.y input[value="area"]').click
      find('.data-selector.y-specifier input[value="1"]').click
      find('button.submit').click

      take_ss('再び追加', 0.5)
      expect(all('.chart-container .c3-legend-item').size).to eq(2)
      expect(all('button.delete[disabled]').size).to eq(0)
      expect(all('button.delete').size).to eq(2)

      all('button.delete')[0].click

      take_ss('最初の縦軸を削除', 0.5)
      expect(all('button.delete[disabled]').size).to eq(1)
      expect(all('.chart-container .c3-legend-item').size).to eq(1)
    end
  end

  feature 'チャートの追加' do
    feature '横軸が年のチャートで追加' do
      before :each do |ex|
        visit '/'
        find('.data-selector.x input[value="year"]').click
        find('.data-selector.y input[value="area"]').click
        find('.data-selector.y-specifier input[value="0"]').click
        find('button.submit').click

      end

      scenario '横軸は選択肢に出ない' do
        take_ss('横軸は選択肢に出ない', 0.5)
        expect(all('.data-selector.x').size).to eq(0)
        expect(all('.data-selector.y input[value="year"]').size).to eq(0)
      end

      scenario 'チャートの追加' do
        take_ss('チャートを表示', 0.5)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('button.delete[disabled]').size).to eq(1)
        expect(all('.chart-container .c3-legend-item').size).to eq(1)

        find('.data-selector.y input[value="area"]').click

        take_ss('地域を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)

        find('.data-selector.y-specifier input[value="1"]').click

        take_ss('北海道を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        take_ss('地域を追加', 0.5)
        expect(all('button.delete[disabled]').size).to eq(0)
        expect(all('button.delete').size).to eq(2)
        expect(all('.chart-container .c3-legend-item').size).to eq(2)

        find('.data-selector.y input[value="way"]').click

        take_ss('手段を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)

        find('.data-selector.y-specifier input[value="hanging"]').click

        take_ss('首つりを選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        take_ss('手段を追加', 0.5)
        expect(all('button.delete').size).to eq(3)
        expect(all('.chart-container .c3-legend-item').size).to eq(3)
      end
    end

    feature '横軸が年以外のチャート（詳細以外）で追加' do
      before :each do |ex|
        visit '/'
        find('.data-selector.x input[value="area"]').click
        find('.data-selector.y input[value="gender"]').click
        find('.data-selector.y-specifier input[value="0"]').click
        find('.data-selector.z-specifier input[value="21"]').click
        find('button.submit').click
      end


      scenario '横軸は選択肢に出ない' do
        take_ss('横軸は選択肢に出ない', 0.5)
        expect(all('.data-selector.x').size).to eq(0)
        expect(all('.data-selector.y input[value="area"]').size).to eq(0)
      end

      scenario 'チャートの追加' do
        take_ss('チャートを表示', 0.5)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('button.delete[disabled]').size).to eq(1)
        expect(all('.chart-container .c3-legend-item').size).to eq(1)
        expect(all('.data-selector.z-specifier').size).to eq(0)

        find('.data-selector.y input[value="gender"]').click

        take_ss('性別を選択、年度を要求', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('.data-selector.z-specifier').size).to eq(1)

        find('.data-selector.y-specifier input[value="1"]').click

        take_ss('女性を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)

        find('.data-selector.z-specifier input[value="21"]').click

        take_ss('年度を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        take_ss('性別を追加', 0.5)
        expect(all('button.delete[disabled]').size).to eq(0)
        expect(all('button.delete').size).to eq(2)
        expect(all('.chart-container .c3-legend-item').size).to eq(2)

        find('.data-selector.y input[value="way"]').click

        take_ss('手段を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('.data-selector.z-specifier').size).to eq(1)

        find('.data-selector.y-specifier input[value="hanging"]').click

        take_ss('首つりを選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)

        find('.data-selector.z-specifier input[value="21"]').click

        take_ss('年度を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        take_ss('手段を追加', 0.5)
        expect(all('button.delete').size).to eq(3)
        expect(all('.chart-container .c3-legend-item').size).to eq(3)
      end
    end

    feature '横軸が年以外のチャート（詳細）で追加' do
      before :each do |ex|
        visit '/'
        find('.data-selector.x input[value="age"]').click
        find('.data-selector.y input[value="gender"]').click
        find('.data-selector.y-specifier input[value="0"]').click
        find('.data-selector.z-specifier input[value="21"]').click
        find('button.submit').click
      end

      scenario '横軸は選択肢に出ない' do
        take_ss('他の詳細も選択肢に出ない', 0.5)
        expect(all('.data-selector.x').size).to eq(0)
        expect(all('.data-selector.y input[value="age"]').size).to eq(0)
        expect(all('.data-selector.y input[value="housemate"]').size).to eq(0)
        expect(all('.data-selector.y input[value="way"]').size).to eq(0)
      end

      scenario 'チャートの追加' do
        take_ss('チャートを表示', 0.5)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('button.delete[disabled]').size).to eq(1)
        expect(all('.chart-container .c3-legend-item').size).to eq(1)
        expect(all('.data-selector.z-specifier').size).to eq(0)

        find('.data-selector.y input[value="gender"]').click

        take_ss('性別を選択、年度を要求', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('.data-selector.z-specifier').size).to eq(1)

        find('.data-selector.y-specifier input[value="1"]').click

        take_ss('女性を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)

        find('.data-selector.z-specifier input[value="21"]').click

        take_ss('年度を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        take_ss('性別を追加', 0.5)
        expect(all('button.delete[disabled]').size).to eq(0)
        expect(all('button.delete').size).to eq(2)
        expect(all('.chart-container .c3-legend-item').size).to eq(2)

        find('.data-selector.y input[value="area"]').click

        take_ss('地域を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)
        expect(all('.data-selector.z-specifier').size).to eq(1)

        find('.data-selector.y-specifier input[value="1"]').click

        take_ss('北海道を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(1)

        find('.data-selector.z-specifier input[value="21"]').click

        take_ss('年度を選択', 0.2)
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        take_ss('北海道を追加', 0.5)
        expect(all('button.delete').size).to eq(3)
        expect(all('.chart-container .c3-legend-item').size).to eq(3)
      end
    end
  end
end