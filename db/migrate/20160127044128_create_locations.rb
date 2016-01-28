class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :home, null: false
      t.integer :building, null: false
      t.integer :vehicle, null: false
      t.integer :sea, null: false
      t.integer :mountain, null: false
      t.integer :other, null: false
      t.integer :unknown, null: false
    end
  end
end
