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

    scope :in, ->(target_year) { includes { year }.joins { year }.where { year.content.in target_year } }
    scope :at, ->(target_area) { includes { area }.joins { area }.where { area.content.in target_area } }
    scope :by, ->(target_gender) { includes { gender }.joins { gender }.where { gender.content.in target_gender } }

    def tagged_data
      {
        year: year.as_json,
        area: area.as_json,
        gender: gender.as_json
      }
    end

    def as_json(options = {})
      options.merge!(except: [:id, :gender_id, :area_id, :year_id])
      super.merge!(tagged_data).deep_symbolize_keys!
    end
  end
end