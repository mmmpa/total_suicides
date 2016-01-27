class CreateReasons < ActiveRecord::Migration
  def change
    create_table :reasons do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :family
      t.integer :health
      t.integer :life
      t.integer :work
      t.integer :partner
      t.integer :school
      t.integer :other
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
