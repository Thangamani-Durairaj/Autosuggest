using System;
using System.Linq;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;

public partial class Search : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }

    [WebMethod]
    public static string ResumeSearch(string strSearchText)
    {
        try
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["dbcon"].ToString());
            conn.Open();
            SqlCommand comm = new SqlCommand("[dbo].[spResumeSearch]", conn);
            comm.CommandType = System.Data.CommandType.StoredProcedure;
            comm.Parameters.AddWithValue("@strSearchText", strSearchText);

            SqlDataAdapter data = new SqlDataAdapter(comm);
            conn.Close();
            DataSet ds = new DataSet();
            data.Fill(ds);

            return Newtonsoft.Json.JsonConvert.SerializeObject(ds.Tables[0]);
        }
        catch (SqlException ex1)
        {
            return string.Empty;
        }
        catch (Exception ex2)
        {
            return string.Empty;
        }
    }

    [WebMethod]
    public static string GetDataList(string strType)
    {
        try
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["dbcon"].ToString());
            conn.Open();
            SqlCommand comm = new SqlCommand("[dbo].[spGetSearchKeys]", conn);
            comm.CommandType = System.Data.CommandType.StoredProcedure;
            comm.Parameters.AddWithValue("@strType", strType);

            SqlDataAdapter data = new SqlDataAdapter(comm);
            conn.Close();
            DataSet ds = new DataSet();
            data.Fill(ds);

            return Newtonsoft.Json.JsonConvert.SerializeObject(ds.Tables[0]);
        }
        catch (SqlException ex1)
        {
            return string.Empty;
        }
        catch (Exception ex2)
        {
            return string.Empty;
        }
    }
    
}

