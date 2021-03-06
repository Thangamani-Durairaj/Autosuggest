
create table [dbo].[Employees](UserCode int identity(1,1),Name nvarchar(300))

insert into [dbo].[Employees](Name) values('Aname'),('Bname'),('Cname')

create proc [dbo].[spResumeSearch]
(@strSearchText nvarchar(100))
as
begin
select UserCode,Name as Title 
from  [dbo].[Employees] where Name like '%'+@strSearchText+'%'
end

ALTER proc [dbo].[spGetSearchKeys]
AS
begin

select UserCode,Name as Title from  [dbo].[Employees] order by Name asc

end