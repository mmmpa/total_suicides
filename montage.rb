files = Dir['./log/ss/**/*.png']
file_names = files.join(' ')
w = 20
h = (files.size / w.to_f).ceil

`montage -background black -tile #{w}x#{h} -geometry 50x30 #{file_names} montagged.png`