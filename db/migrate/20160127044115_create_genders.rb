class CreateGenders < ActiveRecord::Migration
  def change
    create_table :genders do |t|
      t.integer :content
      t.string :name

      t.timestamps null: false
    end
  end
end
