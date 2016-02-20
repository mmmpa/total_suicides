files = Dir['./log/ss/**/*.png']
file_names = files.join(' ')
w = 4
h = (files.size.to_f / w) + 1

`montage -background black -tile #{w}x#{h} -geometry 150x100 #{file_names} montagged.png`