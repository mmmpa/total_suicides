module ApplicationHelper
  DEFAULT_TITLE = '自殺を知る、自殺を考える'
  TAILS = %w(別の自殺者数を で並べて表示)

  def write_title
    ([DEFAULT_TITLE] << [:table, :x].map.with_index { |key, i|
      base = detect_text(params[key])
      base += TAILS[i] if base && TAILS[i]
      base
    }.join).compact.join('::')
  rescue
    '自殺を知る、自殺を考える'
  end

  private

  def detect_text(name)
    case name.to_sym
      when :area
        '地域'
      when :year
        '年度'
      when :age
        '性別'
      when :age
        '年齢層'
      when :housemate
        '同居人の有無'
      when :job
        '職業'
      when :location
        '場所'
      when :way
        '手段'
      when :hour
        '時間帯'
      when :day
        '曜日'
      when :reason
        '動機・要因'
      when :attempted
        '未遂歴'
      when :total
        '総数'
    end
  end
end
