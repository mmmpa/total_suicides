class Total < ActiveRecord::Base
  belongs_to :gender
  belongs_to :area
  belongs_to :year
end
