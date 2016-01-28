module Tagging
  extend ActiveSupport::Concern
  included do
    has_many :genders
    has_many :ages
    has_many :housemates
    has_many :jobs
    has_many :locations
    has_many :ways
    has_many :hours
    has_many :days
    has_many :reasons
    has_many :attempteds
    has_many :totals
  end
end