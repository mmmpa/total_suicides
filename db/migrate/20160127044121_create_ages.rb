class CreateAges < ActiveRecord::Migration
  def change
    create_table :ages do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :o0, null: false
      t.integer :o20, null: false
      t.integer :o30, null: false
      t.integer :o40, null: false
      t.integer :o50, null: false
      t.integer :o60, null: false
      t.integer :o70, null: false
      t.integer :o80, null: false
      t.integer :unknown, null: false
    end
  end
end
