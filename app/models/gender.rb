class Gender < ActiveRecord::Base
  include Tagging

  before_validation :detect_name

  def detect_name
    self.name = case content
                  when 1
                    '女性'
                  when 2
                    '男性'
                  else
                    '総数'
                end
  end

  class << self
    def detect_content(gender)
      case gender
        when :female
          1
        when :male
          2
        else
          0
      end
    end
  end
end
