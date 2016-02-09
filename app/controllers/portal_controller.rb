class PortalController < ApplicationController
  def portal
    case request.fullpath
      when '/'
        @index = true
      else
        nil
    end
  end
end
