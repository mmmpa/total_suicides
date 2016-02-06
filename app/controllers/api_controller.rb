class ApiController < ApplicationController

  Constants::TABLE_NAMES.map do |name|
    class_eval <<-EOS
      def #{name}
        render json: #{name.classify}.in(year).at(area).by(gender), status: 200
      end
    EOS
  end

  def table
    TableCreator.(params)
    render plain: ''
  end

  private

  def detect_scope_param(klass)
    param_name = klass.to_s.downcase

    if params[param_name] == '-'
      klass.pluck(:content)
    else
      params[param_name].split(',').map(&:to_i)
    end
  end

  def year
    detect_scope_param(Year)
  end

  def gender
    detect_scope_param(Gender)
  end

  def area
    detect_scope_param(Area)
  end
end
