class CreateGenders < ActiveRecord::Migration
  def change
    create_table :genders do |t|
      t.integer :content, null: false
      t.string :name, null: false
    end
  end
end
