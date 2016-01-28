module Tagged
  extend ActiveSupport::Concern
  included do |klass|
    pluralized = klass.to_s.downcase.pluralize
    belongs_to :gender, inverse_of: pluralized
    belongs_to :area, inverse_of: pluralized
    belongs_to :year, inverse_of: pluralized

    validates :gender, :area, :year,
              presence: true

    validates :gender,
              uniqueness: {scope: [:area, :year]}

    scope :in, ->(target_year) { joins { year }.where { year.content == target_year } }
    scope :at, ->(target_area) { joins { area }.where { area.content == target_area } }
    scope :by, ->(target_gender) { joins { gender }.where { gender.content == target_gender } }
  end
end