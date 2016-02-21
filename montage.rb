files = Dir['./log/ss/**/*.png']
file_names = files.join(' ')
w = 20
h = (files.size / w.to_f).ceil

`montage -background black -tile #{w}x#{h} -geometry 40x40 #{file_names} montaged.png`