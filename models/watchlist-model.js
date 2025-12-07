const pool = require("../database/")

/* ***************************
 *  Add item to watchlist
 * ************************** */
async function addWatchlistItem(inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.watchlist (inv_id, account_id) VALUES ($1, $2) RETURNING *"
    const data = await pool.query(sql, [inv_id, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("addWatchlistItem error " + error)
    return error.message
  }
}

/* ***************************
 *  Get watchlist items by account_id
 * ************************** */
async function getWatchlistItems(account_id) {
  try {
    const sql = `SELECT w.watchlist_id, w.inv_id, w.account_id, w.watchlist_date_added, 
                i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail 
                FROM public.watchlist AS w 
                JOIN public.inventory AS i ON w.inv_id = i.inv_id 
                WHERE w.account_id = $1`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getWatchlistItems error " + error)
  }
}

/* ***************************
 *  Remove item from watchlist
 * ************************** */
async function removeWatchlistItem(inv_id, account_id) {
  try {
    const sql = "DELETE FROM public.watchlist WHERE inv_id = $1 AND account_id = $2"
    const data = await pool.query(sql, [inv_id, account_id])
    return data
  } catch (error) {
    console.error("removeWatchlistItem error " + error)
    return error.message
  }
}

/* ***************************
 *  Check if item exists in watchlist
 * ************************** */
async function checkExisting(inv_id, account_id) {
  try {
      const sql = "SELECT * FROM public.watchlist WHERE inv_id = $1 AND account_id = $2"
      const data = await pool.query(sql, [inv_id, account_id])
      return data.rowCount
  } catch (error) {
      return 0
  }
}

module.exports = { addWatchlistItem, getWatchlistItems, removeWatchlistItem, checkExisting }
