class CreateAges < ActiveRecord::Migration
  def change
    create_table :ages do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :o0
      t.integer :o20
      t.integer :o30
      t.integer :o40
      t.integer :o50
      t.integer :o60
      t.integer :o70
      t.integer :o80
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
