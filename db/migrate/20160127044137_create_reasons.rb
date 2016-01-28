class CreateReasons < ActiveRecord::Migration
  def change
    create_table :reasons do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :family, null: false
      t.integer :health, null: false
      t.integer :life, null: false
      t.integer :work, null: false
      t.integer :partner, null: false
      t.integer :school, null: false
      t.integer :other, null: false
      t.integer :unknown, null: false
    end
  end
end
