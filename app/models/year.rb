class Year < ActiveRecord::Base
  include Tagging

  before_validation :detect_name

  def detect_name
    self.name = "平成#{content}年"
  end
end
