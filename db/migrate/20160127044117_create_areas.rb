class CreateAreas < ActiveRecord::Migration
  def change
    create_table :areas do |t|
      t.integer :content
      t.string :name

      t.timestamps null: false
    end
  end
end
