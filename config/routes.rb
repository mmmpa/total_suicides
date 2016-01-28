Rails.application.routes.draw do
  scope 'api/:gender/:year/:area' do
    get 'age', to: 'api#age', as: :api_age
    get 'housemate', to: 'api#housemate', as: :api_housemate
    get 'job', to: 'api#job', as: :api_job
    get 'location', to: 'api#location', as: :api_location
    get 'way', to: 'api#way', as: :api_way
    get 'hour', to: 'api#hour', as: :api_hour
    get 'day', to: 'api#day', as: :api_day
    get 'reason', to: 'api#reason', as: :api_reason
    get 'attempted', to: 'api#attempted', as: :api_attempted
    get 'total', to: 'api#total', as: :api_total
  end

  get '', to: 'portal#portal', as: :portal
  get '*path', to: 'portal#portal'
end
