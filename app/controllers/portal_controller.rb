class PortalController < ApplicationController
  def portal
    case request.fullpath
      when '/'
        @index = true
      else
        @data = TableCreator.(params)
    end
  rescue
    nil
  end
end
