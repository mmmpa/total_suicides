module Tagging
  extend ActiveSupport::Concern
  included do |klass|
    has_many :genders, dependent: :destroy
    has_many :ages, dependent: :destroy
    has_many :housemates, dependent: :destroy
    has_many :jobs, dependent: :destroy
    has_many :locations, dependent: :destroy
    has_many :ways, dependent: :destroy
    has_many :hours, dependent: :destroy
    has_many :days, dependent: :destroy
    has_many :reasons, dependent: :destroy
    has_many :attempteds, dependent: :destroy
    has_many :totals, dependent: :destroy

    class << klass
      def selectable
        select { [:name, :content] }
      end
    end
  end
end