require 'pathname'

class ScreenshotMan
  class << self
    attr_accessor :screenshot_dir

    def clean
      `find #{dir_for_save_ss}/ -name '*.png' | xargs rm`
    end

    def dir_for_save_ss
      raise 'Dir required' if screenshot_dir.empty?
      @ss_path = Pathname.new(screenshot_dir)
    end

    def path_for_ss(name)
      @ss_count += 1
      (dir_for_save_ss + @ss_child_dir +  "#{@ss_count}_#{name}.png").to_s
    end

    def ready(*path)
      @ss_count = 0
      @ss_child_dir = path.flatten.join('/')
    end
  end
end
