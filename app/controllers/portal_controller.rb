class PortalController < ApplicationController
  def portal
    case request.fullpath
      when '/'
        @index = true
      else
        pp @data = TableCreator.(params)
    end
  end
end
