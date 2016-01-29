if ENV['import']
  Dir.glob("#{Rails.root}/db/csv/*").each do |file_name|
    Importer.(file_name.split('/').pop)
  end
end