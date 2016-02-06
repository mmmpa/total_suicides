class TableCreator
  ACCEPTABLE = %w(
    year area gender  
    age housemate job location way hour day reason attempted total
  ).map(&:to_sym)

  TABLE = %w(age housemate job location way hour day reason attempted).map(&:to_sym)
  BASE = %w(base table x y).map(&:to_sym)
  FILTER = %w(year area gender column).map(&:to_sym)

  TABLE_COLUMN = {
    tables: [
      {key: 'age', name: '年齢層'},
      {key: 'housemate', name: '同居人の有無'},
      {key: 'job', name: '職業'},
      {key: 'location', name: '場所'},
      {key: 'way', name: '手段'},
      {key: 'hour', name: '時間帯'},
      {key: 'day', name: '曜日'},
      {key: 'reason', name: '原因・動機'},
      {key: 'attempted', name: '未遂歴'},
      {key: 'total', name: '総数'}
    ],
    age: [
      {key: 'o0', name: '20歳未満'},
      {key: 'o20', name: '20-29歳'},
      {key: 'o30', name: '30-39歳'},
      {key: 'o40', name: '40-49歳'},
      {key: 'o50', name: '50-59歳'},
      {key: 'o60', name: '60-69歳'},
      {key: 'o70', name: '70-79歳'},
      {key: 'o80', name: '80歳以上'},
      {key: 'unknown', name: '不詳'},
    ],
    housemate: [
      {key: 'yes', name: 'あり'},
      {key: 'no', name: 'なし'},
      {key: 'unknown', name: '不詳'},
    ],
    job: [
      {key: 'self_employed', name: '自営業・家族従業者'},
      {key: 'employed', name: '被雇用・勤め人'},
      {key: 'student', name: '学生・生徒等'},
      {key: 'stay_at_home', name: '主婦'},
      {key: 'lost_job', name: '失業者'},
      {key: 'pensioner', name: '年金・雇用保険等生活者'},
      {key: 'unemployed', name: 'その他の無職者'},
      {key: 'unknown', name: '不詳'},
    ],
    location: [
      {key: 'home', name: '自宅等'},
      {key: 'building', name: '高層ビル'},
      {key: 'vehicle', name: '乗物'},
      {key: 'sea', name: '海（湖）・河川等'},
      {key: 'mountain', name: '山'},
      {key: 'other', name: 'その他'},
      {key: 'unknown', name: '不詳'},
    ],
    way: [
      {key: 'hanging', name: '首つり'},
      {key: 'poison', name: '服毒'},
      {key: 'briquet', name: '練炭等'},
      {key: 'jumping', name: '飛降り'},
      {key: 'diving', name: '飛込み'},
      {key: 'other', name: 'その他'},
      {key: 'unknown', name: '不詳'},
    ],
    hour: [
      {key: 'a0', name: '0-2時'},
      {key: 'a2', name: '2-4時'},
      {key: 'a4', name: '4-6時'},
      {key: 'a6', name: '6-8時'},
      {key: 'a8', name: '8-10時'},
      {key: 'a10', name: '10-12時'},
      {key: 'a12', name: '12-14時'},
      {key: 'a14', name: '14-16時'},
      {key: 'a16', name: '16-18時'},
      {key: 'a18', name: '18-20時'},
      {key: 'a20', name: '20-22時'},
      {key: 'a22', name: '22-24時'},
      {key: 'unknown', name: '不詳'},
    ],
    day: [
      {key: 'sunday', name: '日曜'},
      {key: 'monday', name: '月曜'},
      {key: 'tuesday', name: '火曜'},
      {key: 'wednesday', name: '水曜'},
      {key: 'thursday', name: '木曜'},
      {key: 'friday', name: '金曜'},
      {key: 'saturday', name: '土曜'},
      {key: 'unknown', name: '不詳'},
    ],
    reason: [
      {key: 'family', name: '家庭問題'},
      {key: 'health', name: '健康問題'},
      {key: 'life', name: '経済・生活問題'},
      {key: 'work', name: '勤務問題'},
      {key: 'partner', name: '男女問題'},
      {key: 'school', name: '学校問題'},
      {key: 'other', name: 'その他'},
      {key: 'unknown', name: '不詳'},
    ],
    attempted: [
      {key: 'yes', name: 'あり'},
      {key: 'no', name: 'なし'},
      {key: 'unknown', name: '不詳'},
    ]
  }

  class << self
    def call(params)
      base, table, x, y = BASE.inject([]) { |a, v| ; a << params[v.to_s].to_sym }
      filters = FILTER.inject({}) { |a, v| a.update(v => params[v.to_s].to_s.split(',')) }
      used = [base, table, x, y]

      unless used.include?(:area)
        filters[:area] = 0
      end

      unless used.include?(:gender)
        filters[:gender] = 0
      end

      base_table = detect(base, table, x, y)

      filtered = filter_table(base_table, filters)
      grouped = group_table(filtered, base)

      grouped.each_pair do |k, v|
        grouped[k] = group_table(v, table)
      end

      grouped.each_pair do |k, v|
        v.each_pair do |kk, vv|
          v[kk] = group_table(vv, x)
        end
      end

      grouped.each_pair do |k, v|
        v.each_pair do |kk, vv|
          vv.each_pair do |kkk, vvv|
            if y == :none
              pp vvv
              vv[kkk] = {'0': vvv.first[:content] || vvv.first[:number]}
            elsif TABLE.include?(y)
              vv[kkk] = columns(y).inject({}) do |a, column_name|
                a.update(column_name => vvv.first[column_name])
              end
            else
              vv[kkk] = vvv.inject({}) do |a, series|
                a.update(series[y].content => series[:content])
              end
            end
          end
        end
      end
      grouped
    end

    def filter_table(base, filters)
      result = base.joins([:year, :area, :gender])
      filters.each_pair do |k, v|
        next unless v.present?
        case
          when 'area'
            result = result.joins { :area }.where { area.content.in v }
          when 'year'
            result = result.joins { :year }.where { year.content.in v }
          when 'gender'
            result = result.joins { :gender }.where { gender.content.in v }
        end
      end
      result.map(&:as_json)
    end

    def group_table(base, table)
      all = (Array === base ? base : base.all)
      if TABLE.include?(table)
        all.inject({}) do |a, target|
          columns(table).each do |column_name|
            a[column_name] ||= []
            a[column_name].push({
                                  content: target[column_name],
                                  year: target[:year],
                                  gender: target[:gender],
                                  area: target[:area]

                                })
          end
          a
        end
      else
        all.group_by { |data| data.send(:[], table).try(:content) }
      end
    end

    def columns(table)
      TABLE_COLUMN[table].map { |c| c[:key] }
    end

    def detect(*args)
      table = args.find do |name|
        TABLE.include?(name)
      end

      detect_table(table || :total)
    end

    def detect_table(name)
      raise NotAcceptable unless ACCEPTABLE.include?(name)
      eval(name.to_s.classify)
    end
  end

  class NotAcceptable < StandardError

  end
end