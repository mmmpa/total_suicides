require 'capybara_helper'

feature 'トップページ' do
  before :each do |ex|
    ready_ss(ex, 800)
  end

  feature '選択肢の切りかえ' do
    scenario '横軸切りかえでの遷移' do
      visit '/'
      sleep 0.2
      take_ss('無選択')

      find('.data-selector.x input[value="year"]').click

      sleep 0.2
      take_ss('年度を選択、縦軸から年度が消える')
      expect(all('.data-selector.y input[value="year"]').size).to eq(0)

      find('.data-selector.x input[value="area"]').click

      sleep 0.2
      take_ss('地域を選択、縦軸から地域が消える')
      expect(all('.data-selector.y input[value="year"]').size).to eq(1)
      expect(all('.data-selector.y input[value="area"]').size).to eq(0)

      find('.data-selector.x input[value="gender"]').click

      sleep 0.2
      take_ss('性別を選択、縦軸から性別が消える')
      expect(all('.data-selector.y input[value="area"]').size).to eq(1)
      expect(all('.data-selector.y input[value="gender"]').size).to eq(0)

      find('.data-selector.x input[value="housemate"]').click

      sleep 0.2
      take_ss('詳細カテゴリのいずれかを選択、縦軸から詳細全てが消える')
      expect(all('.data-selector.y input[value="gender"]').size).to eq(1)
      expect(all('.data-selector.y input[value="age"]').size).to eq(0)
      expect(all('.data-selector.y input[value="housemate"]').size).to eq(0)
      expect(all('.data-selector.y input[value="way"]').size).to eq(0)

      find('.data-selector.x input[value="year"]').click
      sleep 0.2
      take_ss('年度を選択、縦軸が復活する')
      expect(all('.data-selector.y input[value="year"]').size).to eq(0)
      expect(all('.data-selector.y input[value="age"]').size).to eq(1)
      expect(all('.data-selector.y input[value="housemate"]').size).to eq(1)
      expect(all('.data-selector.y input[value="way"]').size).to eq(1)
    end

    scenario '縦軸の切りかえでの遷移（年度が横軸）' do
      visit '/'
      sleep 0.2
      take_ss('無選択')

      find('.data-selector.x input[value="year"]').click

      sleep 0.2
      take_ss('横軸で年度を選択')
      expect(all('.data-selector.y input[value="year"]').size).to eq(0)

      find('.data-selector.y input[value="area"]').click

      sleep 0.2
      take_ss('地域を選択、選択肢が出現')
      expect(all('.data-selector.y-specifier span.input-label')[0].text).to eq('全国')

      find('.data-selector.y input[value="gender"]').click

      sleep 0.2
      take_ss('性別を選択、選択肢が出現')
      expect(all('.data-selector.y-specifier span.input-label')[1].text).to eq('女性')

      find('.data-selector.y input[value="housemate"]').click

      sleep 0.2
      take_ss('同居人を選択、選択肢が出現')
      expect(all('.data-selector.y-specifier span.input-label')[0].text).to eq('あり')

      find('.data-selector.y input[value="way"]').click

      sleep 0.2
      take_ss('手段を選択、選択肢が出現')
      expect(all('.data-selector.y-specifier span.input-label')[0].text).to eq('首つり')
    end

    scenario '縦軸の切りかえでの遷移（年度以外が横軸）' do
      visit '/'
      sleep 0.2
      take_ss('無選択')

      find('.data-selector.x input[value="area"]').click

      sleep 0.2
      take_ss('横軸で地域を選択')
      expect(all('.data-selector.y input[value="area"]').size).to eq(0)

      find('.data-selector.y input[value="gender"]').click

      sleep 0.2
      take_ss('性別を選択、選択肢と年度が出現')
      expect(all('.data-selector.y-specifier span.input-label')[1].text).to eq('女性')
      expect(all('.data-selector.z-specifier').size).to eq(1)

      find('.data-selector.y input[value="year"]').click

      sleep 0.2
      take_ss('年度を選択、選択肢が出現し年度が消える')
      expect(all('.data-selector.y-specifier span.input-label')[0].text).to eq('平成21年')
      expect(all('.data-selector.z-specifier').size).to eq(0)


      find('.data-selector.y input[value="housemate"]').click

      sleep 0.2
      take_ss('同居人を選択、選択肢と年度が出現')
      expect(all('.data-selector.y-specifier span.input-label')[0].text).to eq('あり')
      expect(all('.data-selector.z-specifier').size).to eq(1)

      find('.data-selector.y input[value="way"]').click

      sleep 0.2
      take_ss('手段を選択、選択肢と年度が出現')
      expect(all('.data-selector.y-specifier span.input-label')[0].text).to eq('首つり')
      expect(all('.data-selector.z-specifier').size).to eq(1)
    end


    feature '全体の遷移' do
      scenario '年度を含む（横軸）' do |ex|
        visit '/'
        sleep 0.2
        take_ss('無選択')

        find('.data-selector.x input[value="year"]').click

        sleep 0.2
        take_ss('年度を選択、縦軸から年度が消える')
        expect(find('button.submit[disabled]')).to be_truthy
        expect(all('.data-selector.y input[value="year"]').size).to eq(0)
        expect(find('button.submit[disabled]')).to be_truthy

        find('.data-selector.y input[value="area"]').click

        sleep 0.2
        expect(find('button.submit[disabled]')).to be_truthy
        take_ss('地域を選択')

        find('.data-selector.y-specifier input[value="0"]').click

        sleep 0.2
        expect(all('button.submit[disabled]').size).to eq(0)
        take_ss('地域の詳細を選択、ボタンが押せるようになる')

        find('button.submit').click

        sleep 0.5
        take_ss('チャートを表示')
      end

      scenario '年度を含む（縦軸）' do |ex|
        visit '/'
        sleep 0.2
        take_ss('無選択')
        find('.data-selector.x input[value="housemate"]').click

        sleep 0.2
        take_ss('同居人を選択、縦軸から詳細カテゴリーが消える')
        expect(find('button.submit[disabled]')).to be_truthy
        expect(all('.data-selector.y input[value="housemate"]').size).to eq(0)
        expect(all('.data-selector.y input[value="age"]').size).to eq(0)
        expect(all('.data-selector.z-specifier').size).to eq(0)

        find('.data-selector.y input[value="year"]').click

        sleep 0.2
        take_ss('年度を選択')
        expect(find('button.submit[disabled]')).to be_truthy

        find('.data-selector.y-specifier input[value="26"]').click

        sleep 0.2
        take_ss('年度の詳細を選択、ボタンが押せるようになる')
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        sleep 0.5
        take_ss('チャートを表示')
      end

      scenario '詳細を含む（年度を含まない）' do |ex|
        visit '/'
        sleep 0.2
        take_ss('無選択')
        find('.data-selector.x input[value="housemate"]').click

        sleep 0.2
        take_ss('同居人を選択、縦軸から詳細カテゴリーが消える')
        expect(find('button.submit[disabled]')).to be_truthy
        expect(all('.data-selector.y input[value="housemate"]').size).to eq(0)
        expect(all('.data-selector.y input[value="age"]').size).to eq(0)
        expect(all('.data-selector.z-specifier').size).to eq(0)

        find('.data-selector.y input[value="area"]').click

        sleep 0.2
        take_ss('地域を選択、年度選択肢が出現')
        expect(find('button.submit[disabled]')).to be_truthy
        expect(find('.data-selector.z-specifier')).to be_truthy
        expect(find('button.submit[disabled]')).to be_truthy

        find('.data-selector.y-specifier input[value="0"]').click

        sleep 0.2
        take_ss('地域の詳細を選択、ボタンはまだ押せない')
        expect(find('button.submit[disabled]')).to be_truthy

        find('.data-selector.z-specifier input[value="26"]').click

        sleep 0.2
        take_ss('年度を選択、ボタンが押せるようになる')
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        sleep 0.5
        take_ss('チャートを表示')
      end

      scenario '詳細を含む（年度を含む）' do |ex|
        visit '/'
        sleep 0.2
        take_ss('無選択')
        find('.data-selector.x input[value="housemate"]').click

        sleep 0.2
        take_ss('同居人を選択、縦軸から詳細カテゴリーが消える')
        expect(find('button.submit[disabled]')).to be_truthy
        expect(all('.data-selector.y input[value="housemate"]').size).to eq(0)
        expect(all('.data-selector.y input[value="age"]').size).to eq(0)
        expect(all('.data-selector.z-specifier').size).to eq(0)

        find('.data-selector.y input[value="year"]').click

        sleep 0.2
        take_ss('年度を選択')
        expect(find('button.submit[disabled]')).to be_truthy

        find('.data-selector.y-specifier input[value="26"]').click

        sleep 0.2
        take_ss('年度の詳細を選択、ボタンが押せるようになる')
        expect(all('button.submit[disabled]').size).to eq(0)

        find('button.submit').click

        sleep 0.5
        take_ss('チャートを表示')
      end
    end
  end
end