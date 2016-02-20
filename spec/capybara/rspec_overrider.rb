module RSpec
  module Core
    class ExampleGroup
      def ready_ss(ex)
        #session
        ScreenshotMan.ready(self.class.metadata[:full_description].split(' '), ex.metadata[:description])
      end

      def take_ss(name)
        height = begin
          page.evaluate_script('$("body").height()')+ 400
        rescue
          1000
        end

        page.driver.resize(1240, height)
        page.save_screenshot(ScreenshotMan.path_for_ss(name))
      end
    end
  end
end
