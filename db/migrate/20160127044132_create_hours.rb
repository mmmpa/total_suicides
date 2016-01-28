class CreateHours < ActiveRecord::Migration
  def change
    create_table :hours do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :a0, null: false
      t.integer :a2, null: false
      t.integer :a4, null: false
      t.integer :a6, null: false
      t.integer :a8, null: false
      t.integer :a10, null: false
      t.integer :a12, null: false
      t.integer :a14, null: false
      t.integer :a16, null: false
      t.integer :a18, null: false
      t.integer :a20, null: false
      t.integer :a22, null: false
      t.integer :unknown, null: false
    end
  end
end
