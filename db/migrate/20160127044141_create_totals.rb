class CreateTotals < ActiveRecord::Migration
  def change
    create_table :totals do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :number, null: false
      t.float :rate, null: false
    end
  end
end
