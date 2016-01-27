class CreateDays < ActiveRecord::Migration
  def change
    create_table :days do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :monday
      t.integer :tuesday
      t.integer :wednesday
      t.integer :thursday
      t.integer :friday
      t.integer :saturday
      t.integer :sunday
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
