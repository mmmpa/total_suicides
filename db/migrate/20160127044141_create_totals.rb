class CreateTotals < ActiveRecord::Migration
  def change
    create_table :totals do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :number
      t.float :rate

      t.timestamps null: false
    end
  end
end
