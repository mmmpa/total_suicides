class CreateAttempteds < ActiveRecord::Migration
  def change
    create_table :attempteds do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :yes
      t.integer :no
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
