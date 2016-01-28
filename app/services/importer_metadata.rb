module ImporterMetadata
  def index
    7..55
  end

  def area_index
    1
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
      columns: %w(sunday monday tuesday wednesday thursday friday saturday unknown)
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