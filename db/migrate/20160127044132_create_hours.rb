class CreateHours < ActiveRecord::Migration
  def change
    create_table :hours do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :a0
      t.integer :a2
      t.integer :a4
      t.integer :a6
      t.integer :a8
      t.integer :a10
      t.integer :a12
      t.integer :a14
      t.integer :a16
      t.integer :a18
      t.integer :a20
      t.integer :a22
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
