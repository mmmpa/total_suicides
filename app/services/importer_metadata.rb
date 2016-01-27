module ImporterMetadata
  def index
    7..55
  end

  def area_index
    1
  end

  def areas
    %w(全国 北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県 不明)
  end

  def total
    {
      range: 2..3,
      columns: %w(number rate)
    }
  end

  def age
    {
      range: 5..13,
      columns: %w(o0 o20 o30 o40 o50 o60 o70 o80 unknown)
    }
  end

  def housemate
    {
      range: 14..16,
      columns: %w(yes no unknown)
    }
  end

  def job
    {
      range: 17..25,
      columns: %w(self_employed employed total_unemployed student not_student unemployed stay_at_home pensioner unknown)
    }
  end

  def location
    {
      range: 27..33,
      columns: %w(home building vehicle sea mountain other unknown)
    }
  end

  def way
    {
      range: 34..40,
      columns: %w(hanging poison briquet jumping diving other unknown)
    }
  end

  def hour
    {
      range: 41..53,
      columns: %w(a0 a2 a4 a6 a8 a10 a12 a14 a16 a18 a20 a22 unknown)
    }
  end

  def day
    {
      range: 54..61,
      columns: %w(monday tuesday wednesday thursday friday saturday sunday unknown)
    }
  end

  def reason
    {
      range: 62..69,
      columns: %w(family health life work partner school other unknown)
    }
  end

  def attempted
    {
      range: 70..72,
      columns: %w(yes no unknown)
    }
  end

  def tables
    %w(age housemate job location way hour day reason attempted total)
  end
end