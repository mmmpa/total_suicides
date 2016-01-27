class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :home
      t.integer :building
      t.integer :vehicle
      t.integer :sea
      t.integer :mountain
      t.integer :other
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
