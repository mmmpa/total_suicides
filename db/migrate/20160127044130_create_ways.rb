class CreateWays < ActiveRecord::Migration
  def change
    create_table :ways do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :hanging, null: false
      t.integer :poison, null: false
      t.integer :briquet, null: false
      t.integer :jumping, null: false
      t.integer :diving, null: false
      t.integer :other, null: false
      t.integer :unknown, null: false
    end
  end
end
