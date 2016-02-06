class TableCreator
  attr_accessor :raw

  class << self
    def call(params)
      pp JSON.generate(new(params).raw)
    end

    def detect(*args)
      table = args.find do |name|
        TABLE.include?(name)
      end
    end

    def detect_table(name)
      raise NotAcceptable unless ACCEPTABLE.include?(name)
      eval(name.to_s.classify)
    end
  end

  def initialize(params)
    base, table, x, y = pick_key_name(params)
    filters = pick_filters(params)

    arranged_filters = arrange_filters(filters, base, table, x, y)
    base_table = detect(base, table, x, y)

    data = filter_data(base_table, arranged_filters)

    if [base, table, x, y].include?(:year)
      data = [{'結果' => group(data, base, table, x, y)}]
    else
      years = data.group_by { |d| d[:year][:name] }
      data = years.each_pair.inject([]) do |a, (key, year_data)|
        a << {key => group(year_data, base, table, x, y)}
      end
    end

    grouped = data

    self.raw = grouped
  end

  def group(src, base, table, x, y)
    data = src.clone
    data = group_by_base(data, base)
    data = group_by_table(data, table)
    data = group_by_x(data, x)
    finish_by_y(data, y)
  end

  def group_by_base(data, name)
    group_table(data, name)
  end

  def group_by_table(data, name)
    data.each_pair do |key, value|
      data[key] = group_table(value, name)
    end
  end

  def group_by_x(data, name)
    data.each_pair do |_, value|
      value.each_pair do |key2, value2|
        value[key2] = group_table(value2, name)
      end
    end
  end

  def finish_by_y(data, name)
    data.each_pair do |key, value|
      value.each_pair do |key2, value2|
        value2.each_pair do |key3, value3|
          case
            when name == :none
              value2[key3] = {'総数' => value3.first[:content] || value3.first[:number]}
            when TABLE.include?(name)
              value2[key3] = columns(name).inject({}) do |a, column|
                a.update(column[:name] => value3.first[column[:key]])
              end
            else
              value2[key3] = value3.inject({}) do |a, series|
                a.update(series[name][:name] => series[:content])
              end
          end
        end
      end
    end
  end

  #
  # paramsから必要事項を抽出する
  #
  def pick_key_name(params)
    BASE.inject([]) do |a, name|
      a << params[name.to_s].to_sym
    end
  end

  def pick_filters(params)
    FILTER.inject({}) do |a, filter_name|
      a.update(filter_name => params[filter_name.to_s].to_s.split(','))
    end
  end

  #
  # SQL発行にあたってのパラメーターを決定する
  #

  def arrange_filters(filters, *used)
    arranged = filters.clone

    #used = [base, table, x, y]

    # 使用を指定されていない項目にはフィルターを効かせない
    FILTER_DEFAULT.each do |set|
      key = set[:key]
      value = set[:value]
      unless used.include?(key)
        if Proc === value
          filters[key] = value.()
        else
          filters[key] = value
        end
      end
    end

    arranged
  end

  #
  # 必要なデータに絞り込む
  # 絞り込んでいるのでこの時点でHashなどに変形しても問題なし
  #
  def filter_data(base, filters)
    used_base = base || :total
    result = detect_table(used_base).includes{[:year, :area, :gender]}
    filters.each_pair do |k, v|
      next unless v.present?
      case
        when 'area'
          result = result.joins { :area }.where { area.content.in v }
        when 'year'
          result = result.joins { :year }.where { year.content.in v }
        when 'gender'
          result = result.joins { :gender }.where { gender.content.in v }
        else
          nil
      end
    end
    result.all.to_a.map!(&:as_json).map! do |row|
      total = columns(used_base).inject(0) { |a, column| a + row[column[:key]] }.to_f
      columns(used_base).each do |column|
        row[column[:key]] = {
          number: row[column[:key]],
          par: (row[column[:key]] / total).round(2)
        }
      end
      row
    end
  end

  def remap_table_hash(array, table)
    array.inject({}) do |a, data|
      columns(table).each do |column|
        a[column[:name]] ||= []
        a[column[:name]].push(transform_table_data(data, column[:key]))
      end
      a
    end
  end

  def transform_table_data(data, column_name)
    {
      content: data[column_name],
      year: data[:year],
      gender: data[:gender],
      area: data[:area]
    }
  end

  def group_table(base, table)
    if TABLE.include?(table)
      remap_table_hash(base, table)
    else
      base.group_by { |data| data[table][:name] }
    end
  end

  def columns(table)
    TABLE_COLUMN[table]
  end

  def detect(*args)
    self.class.detect(*args)
  end

  def detect_table(name)
    self.class.detect_table(name)
  end

  class NotAcceptable < StandardError

  end

  ACCEPTABLE = %w(
    year area gender
    age housemate job location way hour day reason attempted total
  ).map(&:to_sym)

  TABLE = %w(age housemate job location way hour day reason attempted total).map(&:to_sym)
  BASE = %w(base table x y).map(&:to_sym)
  FILTER = %w(year area gender column).map(&:to_sym)
  FILTER_DEFAULT = [
    {key: :year, value: -> { Year.order { content.desc }.first.content }},
    {key: :gender, value: 0},
    {key: :area, value: 0}
  ]

  TABLE_COLUMN = {
    tables: [
      {key: :age, name: '年齢層'},
      {key: :housemate, name: '同居人の有無'},
      {key: :job, name: '職業'},
      {key: :location, name: '場所'},
      {key: :way, name: '手段'},
      {key: :hour, name: '時間帯'},
      {key: :day, name: '曜日'},
      {key: :reason, name: '原因・動機'},
      {key: :attempted, name: '未遂歴'},
      {key: :total, name: '総数'}
    ],
    age: [
      {key: :o0, name: '20歳未満'},
      {key: :o20, name: '20-29歳'},
      {key: :o30, name: '30-39歳'},
      {key: :o40, name: '40-49歳'},
      {key: :o50, name: '50-59歳'},
      {key: :o60, name: '60-69歳'},
      {key: :o70, name: '70-79歳'},
      {key: :o80, name: '80歳以上'},
      {key: :unknown, name: '不詳'},
    ],
    housemate: [
      {key: :yes, name: 'あり'},
      {key: :no, name: 'なし'},
      {key: :unknown, name: '不詳'},
    ],
    job: [
      {key: :self_employed, name: '自営業・家族従業者'},
      {key: :employed, name: '被雇用・勤め人'},
      {key: :student, name: '学生・生徒等'},
      {key: :stay_at_home, name: '主婦'},
      {key: :lost_job, name: '失業者'},
      {key: :pensioner, name: '年金・雇用保険等生活者'},
      {key: :unemployed, name: 'その他の無職者'},
      {key: :unknown, name: '不詳'},
    ],
    location: [
      {key: :home, name: '自宅等'},
      {key: :building, name: '高層ビル'},
      {key: :vehicle, name: '乗物'},
      {key: :sea, name: '海（湖）・河川等'},
      {key: :mountain, name: '山'},
      {key: :other, name: 'その他'},
      {key: :unknown, name: '不詳'},
    ],
    way: [
      {key: :hanging, name: '首つり'},
      {key: :poison, name: '服毒'},
      {key: :briquet, name: '練炭等'},
      {key: :jumping, name: '飛降り'},
      {key: :diving, name: '飛込み'},
      {key: :other, name: 'その他'},
      {key: :unknown, name: '不詳'},
    ],
    hour: [
      {key: :a0, name: '0-2時'},
      {key: :a2, name: '2-4時'},
      {key: :a4, name: '4-6時'},
      {key: :a6, name: '6-8時'},
      {key: :a8, name: '8-10時'},
      {key: :a10, name: '10-12時'},
      {key: :a12, name: '12-14時'},
      {key: :a14, name: '14-16時'},
      {key: :a16, name: '16-18時'},
      {key: :a18, name: '18-20時'},
      {key: :a20, name: '20-22時'},
      {key: :a22, name: '22-24時'},
      {key: :unknown, name: '不詳'},
    ],
    day: [
      {key: :sunday, name: '日曜'},
      {key: :monday, name: '月曜'},
      {key: :tuesday, name: '火曜'},
      {key: :wednesday, name: '水曜'},
      {key: :thursday, name: '木曜'},
      {key: :friday, name: '金曜'},
      {key: :saturday, name: '土曜'},
      {key: :unknown, name: '不詳'},
    ],
    reason: [
      {key: :family, name: '家庭問題'},
      {key: :health, name: '健康問題'},
      {key: :life, name: '経済・生活問題'},
      {key: :work, name: '勤務問題'},
      {key: :partner, name: '男女問題'},
      {key: :school, name: '学校問題'},
      {key: :other, name: 'その他'},
      {key: :unknown, name: '不詳'},
    ],
    attempted: [
      {key: :yes, name: 'あり'},
      {key: :no, name: 'なし'},
      {key: :unknown, name: '不詳'},
    ],
    total:[
      {key: :number, name: '総数'}
    ]
  }
end