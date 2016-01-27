class Gender < ActiveRecord::Base

  before_validation :detect_name

  def detect_name
    self.name = case content
                  when 1
                    '女性'
                  when 2
                    '男性'
                  when 0
                    '総数'
                  else
                    '不明'
                end
  end

  class << self
    def detect_content(gender)
      case gender
        when :female
          1
        when :male
          2
        when :total
          0
        else
          9
      end
    end
  end
end
