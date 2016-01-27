class CreateWays < ActiveRecord::Migration
  def change
    create_table :ways do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :hanging
      t.integer :poison
      t.integer :briquet
      t.integer :jumping
      t.integer :diving
      t.integer :other
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
